<script lang="typescript">
  import GoBack from '@@Components/GoBack.svelte';
  import Approve from '@@Components/Approve.svelte';
  import Refuse from '@@Components/Refuse.svelte';
  import Info from '@@Components/Info.svelte';
  import Header from '@@Components/Header.svelte';
  import Identity from '@@Components/Identity.svelte';
  import { users } from "@@Stores/users";
  import { onClickApproveRefuse } from '@@Modules/job';
	import { getUser } from '@@Modules/user';
	import { getIdentityVerificationJob } from '@@Modules/identity';

  import type { InfoType } from '@@Modules/info';

  export let params: { jobId: string };

	const user = getUser($users);

  let info: InfoType;

  $: info = { value: '', type: '', loading: true };

	const setInfo = (i: InfoType) => info = i;

  // get job id
  const rawJobList = localStorage.getItem('job.list.pending');
  const jobList = JSON.parse(rawJobList);
  const jobId = jobList[params.jobId].jobId;

  const identityVerificationJob = getIdentityVerificationJob(jobId, user, setInfo);
</script>

<Header title="Verify" />
<Info info={info} />

{#await identityVerificationJob then identityVerificationJobResult}
  <div>
    <table>
      <tr>
        <th>Job</th>
        <th>Original</th>
      </tr>
      <tr>
        <td>
          <Identity 
            identity={identityVerificationJobResult[0]}
          />
        </td>
        <td>
          <Identity 
            identity={identityVerificationJobResult[1]}
          />
        </td>
      </tr>
    </table>
  </div>
  <div class="refuse_approve_button">
    <Approve label="Approve" onclick={() => onClickApproveRefuse(jobId, 1, user, setInfo)}></Approve>
    <Refuse label="Refuse" onclick={() => onClickApproveRefuse(jobId, 0,  user, setInfo)}></Refuse>
  </div>
{/await}

<GoBack />

<style>
  table {
    width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .refuse_approve_button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 50px;
  }
</style>
