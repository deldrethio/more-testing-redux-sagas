// Mimic some API returns
export default {
  login: (username, password) => ({
    ok: true,
    data: {
      auth_token: '1234'
    }
  }),
  getUser: (authToken) => {
    if (authToken === '1234') {
      return {
        ok: true,
        data: {
          name: 'Rick Deckard',
          address: 'Earth'
        }
      };
    }

    return {
      ok: false,
      data: [{
        error: 'Could not validate auth token.'
      }]
    };
  }
};
