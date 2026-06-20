// Category to image asset mapping
const CATEGORY_IMAGES: Record<string, any> = {
  nutrition: require('../../assets/nutrition.png'),
  exercise: require('../../assets/excercise.png'),
  sleep: require('../../assets/sleep.png'),
  stress: require('../../assets/stress.png'),
  preventive: require('../../assets/preventivecare.png'),
  biohacking: require('../../assets/biohacking.png'),
  social: require('../../assets/social.png'),
  environmental: require('../../assets/environmental.png'),
  cognitive: require('../../assets/cognitive.png'),
  medical: require('../../assets/medical.png'),
  'work-life': require('../../assets/workandlife.png'),
  financial: require('../../assets/financial.png'),
  supplements: require('../../assets/supplements.png'),
  aging: require('../../assets/aging.png'),
  legacy: require('../../assets/legacy.png'),
};

export function getCategoryImage(categoryId: string) {
  return CATEGORY_IMAGES[categoryId] || CATEGORY_IMAGES.sleep;
}
