let leaderboard = [];

function resetData() {
  leaderboard = [];
}

function getLeaderboard() {
  return leaderboard;
}

function updateTeam(index, data) {
  if (leaderboard[index]) {
    leaderboard[index] = { ...leaderboard[index], ...data };
  }
}

function addTeam(teamName) {
  leaderboard.push({
    teamName,
    kills: 0,
    status: [false, false, false, false] // false = alive, true = eliminated
  });
}

function togglePlayerStatus(teamIndex, playerIndex) {
  if (leaderboard[teamIndex]) {
    leaderboard[teamIndex].status[playerIndex] = !leaderboard[teamIndex].status[playerIndex];
  }
}

module.exports = {
  leaderboard,
  resetData,
  getLeaderboard,
  updateTeam,
  addTeam,
  togglePlayerStatus
};
