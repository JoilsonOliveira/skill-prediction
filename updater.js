const fs = require('fs'),
    request = require('request'),
    path = require('path'),
    config = require('./config/config.json'),
    localPackage = require('./package.json')

class AutoUpdater {
    constructor() {
        this.updateAvailable = false
        this.excludedExtensions = ['.exe', '.bak']
        this.excludedFilenames = ['updater.js']
        if (config.updatesCheck)
            this.CheckVersion()
    }

    CheckVersion() {
        request(
            {
                url: (config.currentBranch.toLower() == "experimental") ? config.updateCheckLinkTest : config.updateCheckLinkMaster,
                encoding: 'UTF-8'
            },
            (err, res, data) => {
                if ( res.statusCode != 200 || err) {

                    if (res)
                        console.log(`[Skill Prediction updater] ERROR: status code ${res.statusCode}`)
                    if (err)
                        console.log(`[Skill Prediction updater] ERROR: ${err}`)
                } else {
                    let json = JSON.parse(data)
                    if (this.StringsCompare(json.version, localPackage.version)) {
                        console.log(`[Skill Prediction updater] Skill prediction up to date. Version: ${localPackage.version}` )
                    }
                    else {
                        console.log(`[Skill Prediction updater] Server contains different version! Installed: ${localPackage.version} Server: ${json.version} `)
                        this.updateAvailable = true
                    }
                }
            }
        )
    }

    StringsCompare(string, string1) {
        if (string.localeCompare(string1) == 0)
            return true
        else
            return false
    }

 /*   DownloadUpdate(version) {
        request(
            {
                url: (version == 0) ? this.linkMaster : this.linkTest,
                encoding: 'UTF-8'
            },
            (err, res, data) => {
                if (err || res.statusCode != 200) {

                    if (res)
                        console.log('[SkillPrediction Updater] Status code : ' + res.statusCode)
                    if (err)
                        console.log('[SkillPrediction Updater] Error: ' + err)
                } else {
                    fs.writeFileSync(__dirname + '\\newVersion', data)

                }
            }
        )
    }*/


}
module.exports = AutoUpdater