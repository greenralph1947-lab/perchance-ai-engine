export function register(aiRPG){
  return function(msgContent){
    if(msgContent.startsWith("/npc-add ")){
      const args = msgContent.replace("/npc-add ","").split(" ");
      const name = args[0];
      const genSkills = args[1].toLowerCase() === "yes";
      const prompt = args.slice(2).join(" ");
      aiRPG.npcEngine.add(name, genSkills, prompt);
      return true;
    }

    if(msgContent.startsWith("/npc-list")){
      aiRPG.npcEngine.list();
      return true;
    }

    if(msgContent.startsWith("/npc-edit ")){
      const [id, newName] = msgContent.replace("/npc-edit ","").split(" ");
      aiRPG.npcEngine.editName(id, newName);
      return true;
    }

    return false;
  }
}

