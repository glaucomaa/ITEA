import anketaPriority from "./anketaPriorityInterface";
import visitedEvent from "./visitedEventInterface";

export default interface IUser {
  name: string;
  lastName: string;
  anketaPassed: boolean;
}
