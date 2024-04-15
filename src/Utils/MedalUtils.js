export const getMedal = (numberOfAchievements) => {
  if (numberOfAchievements >= 1 && numberOfAchievements <= 5) {
    return "🥇";
  } else if (numberOfAchievements >= 6 && numberOfAchievements <= 10) {
    return "🥈";
  } else if (numberOfAchievements >= 11 && numberOfAchievements <= 15) {
    return "🥉";
  } else if (numberOfAchievements >= 16 && numberOfAchievements <= 20) {
    return "🎖️";
  } else if (numberOfAchievements >= 21) {
    return "🏅";
  }
  return "🏆"; // Default medal for user levels beyond 20 or no achievements
};
