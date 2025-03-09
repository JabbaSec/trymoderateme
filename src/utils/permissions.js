const BYPASS_IDS = ["270975958511517697"];

function hasAdminAccess(interaction) {
  return (
    interaction.member.roles.cache.has(process.env.ADMIN_ROLE_ID) ||
    BYPASS_IDS.includes(interaction.user.id)
  );
}

module.exports = { hasAdminAccess };
