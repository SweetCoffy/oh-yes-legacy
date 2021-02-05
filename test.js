(async function() {
    var members = await message.guild.members.fetch(); 
    for (const member of members) {
        if (!member.manageable) continue; 
        if (member.displayName.length < 2) continue;
        await member.setNickname(member.user.username[0]);
    }
})()