export function register(aiRPG){
  // Returns a handler function for PFP commands
  return function(msgContent){
    if(msgContent.startsWith("/pfp-generate ")){
      const args = msgContent.replace("/pfp-generate ","").split(" ");
      const name = args[0];
      const num = parseInt(args[1] || "1");
      const prompt = args.slice(2).join(" ");
      aiRPG.pfpEngine.generate(name, num, prompt);
      return true;
    }
    if(msgContent.startsWith("/pfp-list")){
      aiRPG.pfpEngine.list();
      return true;
    }
    if(msgContent.startsWith("/pfp-apply ")){
      const [name, choice] = msgContent.replace("/pfp-apply ","").split(" ");
      aiRPG.pfpEngine.applySelection(name, parseInt(choice));
      return true;
    }
    // Add more PFP commands here (delete, rename, regenerate)
    return false;
  }
}
