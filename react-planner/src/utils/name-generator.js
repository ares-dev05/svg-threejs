export default class NameGenerator {
  static generateName(prototype, type) {
    if (type == undefined) {
      return "";
    }
    return type.substr(0, 1).toUpperCase() + type.substr(1);
  }
}
