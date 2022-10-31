import {get_account, set_mockup, set_mockup_now, set_quiet} from "@completium/experiment-ts";
import {aggregator_event, aggregator_tracker, event_item} from "./bindings/aggregator_tracker";
import {Nat} from "@completium/archetype-ts-types";

const assert = require('assert')

/* Accounts ---------------------------------------------------------------- */

const alice = get_account('alice');
const bob = get_account('bob');
const carl = get_account('carl');
const daniel = get_account('bootstrap1');

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Endpoint ---------------------------------------------------------------- */

//set_mockup()

/* Now --------------------------------------------------------------------- */

//set_mockup_now(new Date(Date.now()))

/* Scenario ---------------------------------------------------------------- */

describe('Contract deployment', async () => {
  it('Deploy aggregator_tracker', async () => {
    await aggregator_tracker.deploy(alice.get_address(), { as: alice })
  });
})

describe('Log aggregator event', async () => {
  it("Log event", async () => {
    const event = new aggregator_event(
        "sale",
        "09616c6c64617461",
        bob.get_address(),
        [carl.get_address(), daniel.get_address()],
        [new event_item(
            "RARIBLE",
            aggregator_tracker.get_address(),
            new Nat(1)
        )]
    )
    await aggregator_tracker.log_event(event, {as: alice})
  })
})
