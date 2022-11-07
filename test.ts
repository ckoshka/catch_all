

import { catchAll } from "./catch_all.ts";

class BabyError extends Error {}

const add = (n1: number, n2: number) => {
    if (n1 > 3 || n1 > 3) {
        throw new BabyError("waah! too big!")
    }
    return n1 + n2;
}

// would be nicer to pass in err and ok as functions that could be called,
// would also provide better type-safety

const addCaught = catchAll<BabyError>()(add);

const x = addCaught("throw", 1, 2)