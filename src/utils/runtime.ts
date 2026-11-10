import Constants, { ExecutionEnvironment } from "expo-constants";

/**
 * Expo Go로 실행 중인지.
 *
 * Expo Go에는 카메라 같은 커스텀 네이티브 모듈이 없어서,
 * 모듈을 import하는 것만으로 앱 전체가 뜨지 않는다.
 * 그래서 불러오기 전에 이 값으로 먼저 걸러야 한다.
 */
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
