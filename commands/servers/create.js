const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const gaming = [1]
module.exports = {
    name: 'createserver',
    description: 'Create a new server',
    
    run: async (client, message, args) => {
        message.channel.send("creating minecraft servers");

        const data = ({
            "name": `${args[0]}`,
            "user": '1',
            "nest": 5,
            "egg": 18,
            "docker_image": "ghcr.io/parkervcp/yolks:nodejs_20",
            "startup": "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ "${MAIN_FILE}" == "*.js" ]]; then /usr/local/bin/node "/home/container/${MAIN_FILE}" ${NODE_ARGS}; else /usr/local/bin/ts-node --esm "/home/container/${MAIN_FILE}" ${NODE_ARGS}; fi",
            "limits": {
                "memory": 0,
                "swap": -1,
                "disk": 2048,
                "io": 500,
                "cpu": 25
            },
            "environment": {
                "MINECRAFT_VERSION": "latest",
                "SERVER_JARFILE": "server.jar",
                "DL_PATH": "https://papermc.io/api/v2/projects/paper/versions/1.16.5/builds/503/downloads/paper-1.16.5-503.jar",
                "BUILD_NUMBER": "latest"
            },
            "feature_limits": {
                "databases": 2,
                "allocations": 1,
                "backups": 10
            },
            "deploy": {
                "locations": gaming,
                "dedicated_ip": false,
                "port_range": []
            },
            "start_on_completion": false,
            "oom_disabled": false
        })

        axios({
            url: `${client.config.panel.panelurl}/api/application/servers`,
            method: 'post',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${client.config.panel.panelapikey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data,
        }).then(response => {
            const embed = new Discord.MessageEmbed()
            .setTitle("Server Created")
            .setDescription(`Server created!`)
            .setColor("#00ff00")
            .addField("Server Name", `${args[0]}`, true)
            .addField("Server ID", `${response.data.attributes.id}`, true)
            .addField('Server UUID', `${response.data.attributes.uuid}`, true)
            .addField('Server Identifier', `${response.data.attributes.identifier}`, true)
            .addField('Server Status', `${response.data.attributes.status}`, true)
            .addField('Server Link', `${client.config.panel.panelurl}/server/${response.data.attributes.identifier}`, true)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true, format: 'png', size: 1024 }));
            message.channel.send({ embeds: [embed] });
            console.log(response.data);
        })
    }
}