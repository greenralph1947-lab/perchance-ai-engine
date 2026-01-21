// pfp_engine.js
aiRPG = aiRPG || {};
aiRPG.pfpEngine = {

  // Generate new avatars using Perchance text-to-image
  async generate(name, numImages, prompt, negativePrompt="blurry, bad anatomy") {
    name = name.toLowerCase();
    const basePrompt = window.basePfpPrompt ? window.basePfpPrompt(prompt) : prompt;

    try {
      let promises = Array.from({ length: numImages }, () =>
        oc.textToImage({
          prompt: basePrompt,
          negativePrompt: negativePrompt,
          seed: `${Math.floor(Math.random()*100000)}`,
          resolution: "512x768",
          model: "furry-drawn"
        })
      );

      let results = await Promise.all(promises);
      let options = await Promise.all(results.map(r => aiRPG.pfpEngine.resize(r.dataUrl, 512)));

      oc.character.customData.pendingAvatarOptions[name] = options;
      oc.character.customData.generatedAvatars[name] = options;

      let content = `Generated ${numImages} avatar options for "${name}". Reply with a number to select:\n\n`;
      options.forEach((url, idx) => {
        content += `**Option ${idx+1}**:<br><img src="${url}" style="width:180px; border-radius:6px;" /><br><br>`;
      });
      oc.thread.messages.push({ author:"system", content, expectsReply:false, customData:{ignoreForAI:true} });

    } catch(e) {
      console.error("Failed to generate avatars:", e);
      oc.thread.messages.push({ author:"system", content:`Failed to generate avatars for "${name}".`, expectsReply:false, customData:{ignoreForAI:true} });
    }
  },

  // Resize DataURL to given width
  async resize(dataURL, newWidth){
    const blob = await fetch(dataURL).then(res=>res.blob());
    const bitmap = await createImageBitmap(blob);
    const canvas = Object.assign(document.createElement("canvas"), { width:newWidth, height:(bitmap.height/bitmap.width)*newWidth });
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  },

  // Apply a selected option
  applySelection(name, choice){
    name = name.toLowerCase();
    const options = oc.character.customData.pendingAvatarOptions[name];
    if(!options || choice<1 || choice>options.length) return false;

    const selected = options[choice-1];
    oc.character.avatar.url = selected;
    oc.character.customData.avatars[name] = selected;
    window.avatarUrls[name] = selected;

    delete oc.character.customData.pendingAvatarOptions[name];

    oc.thread.messages.push({ author:"system", content:`Avatar "${name}" selected and applied.`, expectsReply:false, customData:{ignoreForAI:true} });
    return true;
  },

  // Regenerate avatars (reuse existing options)
  regenerate(name){
    name = name.toLowerCase();
    const options = oc.character.customData.generatedAvatars[name];
    if(!options){
      oc.thread.messages.push({ author:"system", content:`No generated avatars found for "${name}".`, expectsReply:false, customData:{ignoreForAI:true} });
      return;
    }
    oc.character.customData.pendingAvatarOptions[name] = options;

    let content = `Regenerated options for "${name}". Reply with a number to select:\n\n`;
    options.forEach((url, idx) => {
      content += `**Option ${idx+1}**:<br><img src="${url}" style="width:180px; border-radius:6px;" /><br><br>`;
    });
    oc.thread.messages.push({ author:"system", content, expectsReply:false, customData:{ignoreForAI:true} });
  },

  // Delete avatars
  delete(name){
    name = name.toLowerCase();
    delete oc.character.customData.generatedAvatars[name];
    delete oc.character.customData.pendingAvatarOptions[name];
    oc.thread.messages.push({ author:"system", content:`Deleted generated avatars for "${name}".`, expectsReply:false, customData:{ignoreForAI:true} });
  },

  deleteAll(){
    oc.character.customData.generatedAvatars = {};
    oc.character.customData.pendingAvatarOptions = {};
    oc.thread.messages.push({ author:"system", content:`All generated avatars deleted.`, expectsReply:false, customData:{ignoreForAI:true} });
  },

  // Rename avatars
  rename(oldName, newName){
    oldName = oldName.toLowerCase(); newName = newName.toLowerCase();
    if(window.avatarUrls[oldName]) { window.avatarUrls[newName] = window.avatarUrls[oldName]; delete window.avatarUrls[oldName]; }
    if(oc.character.customData.avatars[oldName]) { oc.character.customData.avatars[newName] = oc.character.customData.avatars[oldName]; delete oc.character.customData.avatars[oldName]; }
    if(oc.character.customData.pendingAvatarOptions[oldName]) { oc.character.customData.pendingAvatarOptions[newName] = oc.character.customData.pendingAvatarOptions[oldName]; delete oc.character.customData.pendingAvatarOptions[oldName]; }
    if(oc.character.customData.generatedAvatars[oldName]) { oc.character.customData.generatedAvatars[newName] = oc.character.customData.generatedAvatars[oldName]; delete oc.character.customData.generatedAvatars[oldName]; }

    oc.thread.messages.push({ author:"system", content:`Avatar "${oldName}" has been renamed to "${newName}".`, expectsReply:false, customData:{ignoreForAI:true} });
  },

  // List generated avatars
  list(){
    const names = Object.keys(oc.character.customData.generatedAvatars);
    const content = names.length ? "Generated avatars:\n" + names.join(", ") : "No generated avatars.";
    oc.thread.messages.push({ author:"system", content, expectsReply:false, customData:{ignoreForAI:true} });
  }

};

