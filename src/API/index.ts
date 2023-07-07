import { assert } from '~utils/assert';

import type { ParticipantsResponse } from './types';

export class API {
  static BASE_URL = process.env.PLASMO_PUBLIC_PARTICIPANTS_API_URL;
  static X_ACCESS_KEY = process.env.PLASMO_PUBLIC_PARTICIPANTS_API_X_ACCESS_KEY;

  static async fetchParticipants(): Promise<ParticipantsResponse> {
    assert(API.BASE_URL, 'BASE_URL is not set in .env');
    assert(API.X_ACCESS_KEY, 'X_ACCESS_KEY is not set in .env');

    const result = await fetch(API.BASE_URL, {
      headers: {
        'X-Access-Key': API.X_ACCESS_KEY,
      },
    }).then((response) => {
      console.log(response);

      if (response.ok) {
        return response.json();
      }

      throw new Error(`Request was rejected with code \`${response.status}\``);
    });

    return result;
  }
}
