// ----------------------------
// Helper to dynamically load a script
// ----------------------------
async function loadScript(src){
  return new Promise((resolve,reject)=>{
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = src;
    s.onload = ()=>resolve(src);
    s.onerror = ()=>reject(new Error("Failed to load " + src));
    document.body.appendChild(s);
  });
}

// ----------------------------
// Initialize AI RPG Namespace
// ----------------------------
window.aiRPG = window.aiRPG || {};
const aiRPG = window.aiRPG;

// ----------------------------
// Load core engine scripts
// ----------------------------
(async function(){
  const baseURL = "https://cdn.jsdelivr.net/gh/greenralph1947-lab/perchance-ai-engine@main";

  const coreScripts = [
    `${baseURL}/core/config.js`,
    `${baseURL}/core/state.js`,
    `${baseURL}/core/pfp_engine.js`,
    `${baseURL}/core/npc_engine.js`,
    `${baseURL}/core/skill_engine.js`,
    `${baseURL}/core/message_cycle.js`,
    `${baseURL}/core/gm_adapter.js`,
    `${baseURL}/utils/helpers.js`,
    `${baseURL}/utils/avatar_utils.js`,
    `${baseURL}/utils/data_validation.js`
  ];

  for(const src of coreScripts){
    try { await loadScript(src); }
    catch(e){ console.error("Failed to load:", src, e); }
  }

  console.log("Core AI RPG Engine loaded!", aiRPG);

  // ----------------------------
  // Load command modules
  // ----------------------------
  const commandScripts = [
    `${baseURL}/commands/commands_pfp.js`,
    `${baseURL}/commands/commands_npc.js`,
    `${baseURL}/commands/commands_skills.js`,
    `${baseURL}/commands/commands_check.js`
  ];

  const commandHandlers = [];

  for(const src of commandScripts){
    try {
      const module = await import(src);
      if(module.register) {
        const handler = module.register(aiRPG);
        if(handler) commandHandlers.push(handler);
      }
      console.log("Loaded command module:", src);
    } catch(e){
      console.error("Failed to load command module:", src, e);
    }
  }

  // ----------------------------
  // Listen for player messages
  // ----------------------------
  oc.thread.on("MessageAdded", function(msg){
    if(msg.author !== "player") return;

    const content = msg.content.trim();

    // Run each command handler in order
    for(const handler of commandHandlers){
      if(handler(content)) return; // message handled
    }

    // Normal player message processing happens here
  });

  console.log("AI RPG Engine fully initialized!");
})();
