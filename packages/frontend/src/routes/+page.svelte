<script>
  import { KarmaReceived } from "@glitter-boys/data";
  import { dataSource } from "../db/index";
  import _ from "lodash";

  async function getLeaderboard() {
    const karmaCounts = await dataSource.getRepository(KarmaReceived).find({
      select: {
        id: true,
        karmaReceived: true,
      },
    });

    let rank = 0;
    let prev;

    const leaderboard = await Promise.all(
      _.map(karmaCounts, async (value) => {
        // show ties
        if (value.karmaReceived !== prev) {
          rank++;
        }
        // make a copy of rank. I think this is required because the function is async?
        const myRank = rank;
        prev = value.karmaReceived;

        let rankString = `#${myRank.toString()}`;
        // top 3 are better than everyone else
        if (myRank <= 3) {
          rankString = rankString;
        }

        return `${rankString}: ${value.id} (${value.karmaReceived} karma)`;
      })
    );
    return leaderboard;
  }
</script>

<h1>Karma Leaderboard</h1>
{#await getLeaderboard()}
  <p>...waiting</p>
{:then leaderboard}
  <ol>
    {#each leaderboard as entry}
      <li>
        {entry}
      </li>
    {/each}
  </ol>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
