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
    const leaderboard = (
      await Promise.all(
        _.map(karmaCounts, async (value) => {
          // show ties
          if (value.karmaReceived !== prev) {
            rank++;
          }
          // make a copy of rank. I think this is required because the function is async?
          const myRank = rank;
          prev = value.karmaReceived;

          // mention the user who called the leaderboard command
          let user = (await client.users.fetch(value.id, { cache: true })).username;
          if (interaction.user.id === value.id) {
            user = userMention(interaction.user.id);
          }

          let rankString = `#${myRank.toString()}`;
          // top 3 are better than everyone else
          if (myRank <= 3) {
            rankString = bold(rankString);
          }

          return `${rankString}: ${user} (${value.karmaReceived} karma)`;
        })
      )
    ).join("\n");
    return leaderboard;
  }
</script>

<h1>Karma Leaderboard</h1>
{#await getLeaderboard()}
  <p>...waiting</p>
{:then leaderboard}
  {leaderboard}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
