module.exports = (client, invite) => {
    client.guilds.cache.get(config.server_id).invites.fetch().then(guildInvites => {
        let invites = []

        guildInvites.forEach(invite => {
            invites.push({ code: invite.code, inviter: invite.inviter.id, uses: invite.uses })
        });

        fs.writeFileSync("invites/cache.json", JSON.stringify(invites));
    });
}