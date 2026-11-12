/**
 * 모델 클래스 라벨에 붙는 변형 번호를 떼는 규칙.
 * 서버가 bare 형태를 만들 때 쓰는 규칙과 같아야 한다.
 */
const VARIANT_SUFFIX = /#?\d+#?$|#$/;

/**
 * 모델이 돌려준 라벨에서 변형 번호를 떼고 사람이 읽는 형태로 만든다.
 *
 * predicted는 "가능1"처럼 변형 번호가 붙어 온다.
 * 그대로 화면에 쓰면 학습 단어에 없는 이름이 보이므로 떼고 보여준다.
 * 번호만 남는 라벨이라면 뗄 게 아니라서 원래 값을 그대로 쓴다.
 */
export const toBareSignLabel = (label: string) =>
  label.replace(VARIANT_SUFFIX, "").trim() || label;
