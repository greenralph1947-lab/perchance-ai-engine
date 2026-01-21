// loader.js
// Initializes global objects for the AI RPG engine

// Ensure aiRPG namespace exists
window.aiRPG = window.aiRPG || {};

// Ensure the pfpEngine object exists (will be populated by pfp_engine.js)
window.aiRPG.pfpEngine = window.aiRPG.pfpEngine || {};

// Ensure oc (character context) exists
window.oc = window.oc || {};
oc.character = oc.character || {};
oc.character.customData = oc.character.customData || {};
oc.character.avatar = oc.character.avatar || { url: "" };

// Ensure structures for avatars are initialized
oc.character.customData.generatedAvatars = oc.character.customData.generatedAvatars || {};
oc.character.customData.pendingAvatarOptions = oc.character.customData.pendingAvatarOptions || {};
oc.character.customData.avatars = oc.character.customData.avatars || {};

// Minimal thread simulation (used by system messages)
oc.thread = oc.thread || {};
oc.thread.messages = oc.thread.messages || [];

// Helper to push system messages (optional, makes pfp_engine.js compatible)
oc.thread.pushSystemMessage = function(content) {
  oc.thread.messages.push({ author: "system", content, expectsReply: false, customData: { ignoreForAI: true } });
};

console.log("loader.js initialized: aiRPG, oc, and avatar structures ready.");

