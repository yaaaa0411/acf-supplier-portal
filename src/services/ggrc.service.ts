const GGRC_API_URL = import.meta.env.VITE_GGRC_API_URL || 'http://localhost:3001';

export class GgrcError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'GgrcError';
  }
}

/**
 * Trigger GGRC Payment Receipt download via backend API.
 * Streams back the PDF as a Blob.
 */
export async function downloadGgrcReceipt(workOrderNumber: string): Promise<Blob> {
  try {
    const response = await fetch(`${GGRC_API_URL}/api/download-ggrc-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workOrderNumber }),
    });

    if (!response.ok) {
      let errData;
      try {
        errData = await response.json();
      } catch (e) {
        throw new GgrcError('Unable to download receipt. GGRC service error.', 'SERVER_ERROR');
      }

      throw new GgrcError(
        errData.message || 'Failed to download GGRC Payment Receipt.',
        errData.error || 'SERVER_ERROR'
      );
    }

    return await response.blob();
  } catch (err: any) {
    if (err instanceof GgrcError) {
      throw err;
    }
    throw new GgrcError(
      err.message || 'Network error connecting to GGRC downloader service.',
      'NETWORK_ERROR'
    );
  }
}
