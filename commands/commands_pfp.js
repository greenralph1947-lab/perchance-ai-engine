// commands_pfp.js
oc.registerCommand("/pfp", async (args, rawText)=>{
  const match = rawText.match(/^\/pfp\s+(\S+)\s+(\d+)\s+(.+?)(?:\s+\[([^\]]+)\])?$/);
  if(!match) return oc.thread.messages.push({ author:"system", content:'Invalid /pfp format. Use: /pfp name number prompt [negative prompt]', expectsReply:false, customData:{ignoreForAI:true} });

  const [, name, numRaw, prompt, negative] = match;
  const num = parseInt(numRaw) || 1;
  await aiRPG.pfpEngine.generate(name, num, prompt, negative);
});

oc.registerCommand("/regen", (args)=>{
  const name = args[0];
  aiRPG.pfpEngine.regenerate(name);
});

oc.registerCommand("/del", (args)=>{
  const name = args[0];
  aiRPG.pfpEngine.delete(name);
});

oc.registerCommand("/del-all", ()=>{
  aiRPG.pfpEngine.deleteAll();
});

oc.registerCommand("/rename", (args)=>{
  if(args.length < 2) return oc.thread.messages.push({ author:"system", content:'Usage: /rename oldName newName', expectsReply:false, customData:{ignoreForAI:true} });
  aiRPG.pfpEngine.rename(args[0], args[1]);
});

oc.registerCommand("/list", ()=>{
  aiRPG.pfpEngine.list();
});

// Automatically handle pending selection (user types 1,2,3 etc.)
oc.thread.on("MessageAdded", ({message})=>{
  if(message.author !== "user") return;

  const text = message.content.trim();
  Object.keys(oc.character.customData.pendingAvatarOptions || {}).forEach(name=>{
    const choice = parseInt(text);
    if(!isNaN(choice)) aiRPG.pfpEngine.applySelection(name, choice);
  });
});

