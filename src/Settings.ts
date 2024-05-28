import { PluginSettingTab, App, Setting } from "obsidian";
import ExpiringNotesPlugin from "main";

export default class ExpiringNotesSettingTab extends PluginSettingTab {
	plugin: ExpiringNotesPlugin;

	constructor(app: App, plugin: ExpiringNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Expiring Notes settings'});

        new Setting(containerEl)
        .setName('Check for expired notes at startup')
        .addToggle((t) => {
            t.setValue(this.plugin.settings.checkOnStartup);
            t.onChange(async (v) => {
                this.plugin.settings.checkOnStartup = v;
                await this.plugin.saveSettings();
            });
        });

		new Setting(containerEl)
			.setName('Frontmatter key')
			.setDesc('Enter the key which you would like to use in your note\'s frontmatter to identify the note\'s expiry date.')
			.addText(text => text
				.setPlaceholder('expires')
				.setValue(this.plugin.settings.frontmatterKey)
				.onChange(async (value) => {
					this.plugin.settings.frontmatterKey = value;
					await this.plugin.saveSettings();
				})
            );
		
        let desc = document.createDocumentFragment();
        desc.append(
            'Set the date format you prefer to use to specify your expiry dates.',
            desc.createEl('br'),
            'Visit ',
            desc.createEl('a', {
                href: 'https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/',
                text: 'momentjs.com',
            }),
            ' to get a list of all available tokens.'
        );
    
        let dateFormatSetting = new Setting(containerEl)
            .setName('Date format')
            .setDesc(desc)
			.addText(text => text
				.setPlaceholder('YYYY-MM-DD')
				.setValue(this.plugin.settings.dateFormat)
				.onChange(async (value) => {
                    if(!value) {
                        value = 'YYYY-MM-DD';
                    }
					this.plugin.settings.dateFormat = value;
					await this.plugin.saveSettings();
				})
            );
        

        new Setting(containerEl)
            .setName('Enable confirm dialogue')
            .setDesc('Shows a dialog asking you to confirm before archiving / deleting expired notes.')
            .addToggle((t) => {
                t.setValue(this.plugin.settings.confirm);
                t.onChange(async (v) => {
                    this.plugin.settings.confirm = v;
                    await this.plugin.saveSettings();
                });
            });

		new Setting(containerEl)
			.setName('Behavior')
			.setDesc('Choose what should happen to your notes once they have expired.')
			.addDropdown((d) => {
				d.addOption("delete", "Delete file");
				d.addOption("archive", "Move to archive folder");
				d.setValue(this.plugin.settings.behavior);
				d.onChange(async (v: "delete" | "archive") => {
					this.plugin.settings.behavior = v;
                    this.display();
					await this.plugin.saveSettings();
				}
            );
        });

        if (this.plugin.settings.behavior == 'archive') {
            new Setting(containerEl)
            .setName('Archive folder path')
            .setDesc('The path to your preferred archive folder, for example "Archive" or "Trash"')
            .addText(text => text
                .setPlaceholder(this.plugin.settings.archivePath)
                .setValue(this.plugin.settings.archivePath)
                .onChange(async (value) => {
					this.plugin.settings.archivePath = value;
					await this.plugin.saveSettings();
				})
            );
        }
        new Setting(containerEl)
            .setName('Day offset')
            .setDesc('Set an amount of days to add to the expiry date. For example, if you set this to 1, the note will expire one day after the date specified in the frontmatter.')
            .addText(text => text
				.setPlaceholder('0')
				.setValue(this.plugin.settings.offsetDays)
				.onChange(async (value) => {
                    if(!value) {
                        value = '0';
                    }
					this.plugin.settings.offsetDays = value;
					await this.plugin.saveSettings();
				})
            );
        
    }
}
