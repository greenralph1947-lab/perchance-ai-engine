export function register(aiRPG){
  return function(msgContent){
    if(msgContent.includes("(skill check)")){
      const playerRoll = Math.floor(Math.random()*20)+1;
      const obstacleRoll = Math.floor(Math.random()*20)+1;
      console.log(`Skill Check - Player: ${playerRoll}, Obstacle: ${obstacleRoll}`);

      // Optional: send a system message to player
      if(typeof aiRPG.pushSystemMessage === "function"){
        aiRPG.pushSystemMessage(`Skill Check Results: Player rolled ${playerRoll}, Obstacle rolled ${obstacleRoll}`);
      }
      return false; // still allow GM to respond
    }
    return false;
  }
}

