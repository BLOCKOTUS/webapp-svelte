<script lang="typescript">
    import { push } from 'svelte-spa-router';

    import GoBack from '@@Components/GoBack.svelte';
    import Approve from '@@Components/Approve.svelte';
    import Refuse from '@@Components/Refuse.svelte';
    import Info from '@@Components/Info.svelte';
    import Header from '@@Components/Header.svelte';
    import Identity from '@@Components/Identity.svelte';
    import { users } from "@@Stores/users";
    import { onClickApproveRefuse } from '@@Modules/job';
    import { getLoggedInUser } from '@@Modules/user';
    import { getIdentityVerificationJob, canApproveIdentityVerificationJob } from '@@Modules/identity';

    import type { InfoType } from '@@Modules/info';

    export let params: { jobId: string };

    const user = getLoggedInUser($users);

    let info: InfoType;

    $: info = { value: '', type: '', loading: true };

    const onInfo = (i: InfoType) => info = i;
    const onComplete = () => setTimeout(() => push('/kyc/jobs'), 1500);

    // get job id
    const rawJobList = localStorage.getItem('job.list.pending');
    const jobList = JSON.parse(rawJobList);
    const jobId = jobList[params.jobId].jobId;

    const identityVerificationJob = getIdentityVerificationJob({ jobId, user, onInfo });
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
        <Approve label="Approve" onclick={() => onClickApproveRefuse({ jobId, result: 1, user, onInfo, onComplete })} disabled={!canApproveIdentityVerificationJob(identityVerificationJobResult)}></Approve>
        <Refuse label="Refuse" onclick={() => onClickApproveRefuse({ jobId, result: 0,  user, onInfo, onComplete })}></Refuse>
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
