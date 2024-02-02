const { app } = require('@azure/functions');

/**
 * @param {import('@azure/functions').HttpRequest} request
 * @param {import('@azure/functions').Context} context
 */
app.http('checkRoles', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    if (
      !request ||
      !request.body ||
      !request.body.identityProvider ||
      !request.body.userDetails ||
      request.identityProvider !== 'aad'
    ) {
      return new Response(400, `Invalid request.`);
    }

    if (isEligible(request.body.userDetails)) {
      return { roles: ['aidworker'] };
    }

    return { roles: [] };
  },
});

/**
 * @param {string} email
 * @returns {boolean}
 */
function isEligible(email) {
  const eligibleDomains = (process.env.HIA_ELIGIBLE_DOMAINS || '')
    .split(',')
    .map((domain) => domain.trim().toLowerCase());
  const emailDomain = email.split('@')[1];

  return !!emailDomain && eligibleDomains.includes(emailDomain.toLowerCase());
}
