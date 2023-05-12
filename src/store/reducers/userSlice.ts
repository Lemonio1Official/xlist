import { createSlice } from "@reduxjs/toolkit";

export type todo = {
  id: number;
  task: string;
  extime: number;
  priority: 0 | 1 | 2;
  reasons: string[];
  days: number[];
};

type todayTodo = {
  id: number;
  task: string;
  priority: 0 | 1 | 2;
  time: string;
  reasons: [boolean, string][];
  done: boolean;
};

interface IUser {
  user: { id: number; email: string; password: string; schedule: string; freetime: string; reasons: string; todos: todo[] };
  todos: todayTodo[];
  stats: { score: number[]; date: string[] };
  test: boolean;
  oldTest: boolean;
  load: boolean;
}

const initialState: IUser = {
  user: {
    id: 0,
    email: "",
    password: "",
    schedule: "09:00 - 18:00",
    freetime: "[]",
    reasons: "[]",
    todos: [],
  },
  todos: [],
  stats: { score: [], date: [] },
  test: false,
  oldTest: false,
  load: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (s, { payload }) => {
      s.user = payload;
    },
    setUserLoad: (s) => {
      s.load = true;
    },
    logOut: (s) => {
      s.user = initialState.user;
    },
    setSchedule: (s, { payload }) => {
      s.user.schedule = payload;
    },
    FreeTime: (s, { payload }) => {
      let freetime = JSON.parse(s.user.freetime);
      if (payload[0] === "add") freetime.push(payload[1]);
      else freetime = freetime.filter((_: string, i: number) => i !== payload[1]);
      s.user.freetime = JSON.stringify(freetime);
    },
    Reason: (s, { payload }) => {
      let reasons = JSON.parse(s.user.reasons);
      if (payload[0] === "add") reasons.push(payload[1]);
      else reasons = reasons.filter((_: string, i: number) => i !== payload[1]);
      s.user.reasons = JSON.stringify(reasons);
    },
    Todo: (s, { payload }) => {
      switch (payload[0]) {
        case "add":
          s.user.todos.push(payload[1]);
          break;
        case "edit":
          s.user.todos = s.user.todos.map((i) => {
            if (i.task === payload[1].task) return payload[1].todo;
            return i;
          });
          break;
        case "del":
          s.user.todos = s.user.todos.filter((_, i) => i !== payload[1]);
          break;
      }
    },
    setTodos: (s, { payload }) => {
      s.todos = payload;
      if (s.todos.find((i) => i.reasons.length > 0) === undefined) s.test = true;
    },
    markReason: (s, { payload }) => {
      if (!payload[0]) {
        s.todos = s.todos.map((i) => {
          i.reasons = i.reasons.map((i) => {
            if (i[1] === payload[1]) i[0] = true;
            return i;
          });
          return i;
        });
      } else {
        s.todos = s.todos.filter((i) => i.reasons.find((i) => i[1] === payload[1]) === undefined);
      }
      s.test = !s.todos.find((i) => i.reasons.find((i) => i[0] === false)) ? true : false;
    },
    setOldTest: (s) => {
      s.oldTest = true;
      s.test = false;
    },
    setStats: (s, { payload }: { payload: { score: number; date: string }[] }) => {
      const score: number[] = [];
      const date: string[] = [];
      payload.map((i) => {
        score.push(i.score);
        const newdate = i.date
          .split(".")
          .map((i, ind) => {
            if (ind === 2) return i.slice(-2);
            else return i;
          })
          .join(".");
        date.push(newdate);
      });
      s.stats.score = score;
      s.stats.date = date;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setUserLoad, logOut, setSchedule, FreeTime, Reason, Todo, setTodos, markReason, setOldTest, setStats } =
  userSlice.actions;
