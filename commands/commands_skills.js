export function register(aiRPG){
  return function(msgContent){
    if(msgContent.startsWith("/skills-re ")){
      const [oldName, newName] = msgContent.replace("/skills-re ","").split(" ");
      aiRPG.skillEngine.renameSkill(oldName, newName);
      return true;
    }

    if(msgContent.startsWith("/skills-edit")){
      const args = msgContent.replace("/skills-edit ","").split(" ");
      const action = args[0]; // "add" or number to remove
      if(action === "add"){
        const newSkill = args.slice(1).join(" ");
        aiRPG.skillEngine.addSkill(newSkill);
      } else {
        const index = parseInt(action);
        aiRPG.skillEngine.removeSkill(index);
      }
      return true;
    }

    if(msgContent.startsWith("/skills-list")){
      aiRPG.skillEngine.list();
      return true;
    }

    return false;
  }
}

