<script lang="typescript">
  import { push } from 'svelte-spa-router';
  import { Crypt } from 'hybrid-crypto-js';

  import appConfig from '@@Config/app';
  import GoBack from '@@Components/GoBack.svelte';
  import Approve from '@@Components/Approve.svelte';
  import Refuse from '@@Components/Refuse.svelte';
  import Info from '@@Components/Info.svelte';
  import Header from '@@Components/Header.svelte';
  import Identity from '@@Components/Identity.svelte';
  import { users } from "@@Stores/users";
  import { request } from '@@Modules/nerves';

  import type { InfoType } from '@@Components/Info';
  import type { RequestIdentityResponse, IdentityType } from '@@Modules/identity';
  import type { RequestJobResponse } from '@@Modules/job';

  export let params: { jobId: string };

  const username = $users.loggedInUser;
  const wallet = $users.users.filter(u => u.username === username)[0].wallet;
  const keypair = $users.users.filter(u => u.username === username)[0].keypair;

  let info: InfoType;
  let decryptedOriginalIdentity: IdentityType;
  let resOriginalData: RequestIdentityResponse;
  $: info = { value: '', type: '', loading: true };
  $: decryptedOriginalIdentity = { firstname: '', lastname: '', nation: '', nationalId: '' };
  $: resOriginalData = null;

  const onClickApproveRefuse = async (i, result) => {
    console.log(`Approve ${i}`);

    info.type = 'info';
    info.value = 'Submiting result...';
    info.loading = true;

    const resComplete: RequestJobResponse | void = await request({
      username,
      wallet,
      url: appConfig.nerves.job.complete.url,
      method: 'POST',
      data: {
        jobId,
        result,
      },
    }).catch(_e => {
      info.type = 'error';
      info.value = _e.message || 'error';
      info.loading = false;
    });

    if(!resComplete) return;

    if(!resComplete.data.success){
      info.type = 'error';
      info.value = resComplete.data.message || 'error';
      info.loading = false;
      return;
    }

    info.type = 'info';
    info.value = 'Job complete. You will be redirected to the job list.';
    setTimeout(() => push('/kyc/jobs'), 1500);
  };

  // get job id
  const rawJobList = localStorage.getItem('job.list.pending');
  const jobList = JSON.parse(rawJobList);
  const jobId = jobList[params.jobId].jobId;

  const getDecryptedJob = async (): Promise<IdentityType> => {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      // get job details
      const resJob = await request({
        username,
        wallet,
        url: appConfig.nerves.job.url,
        method: 'GET',
        params: {
          jobId,
        },
      });

      if(!resJob.data.job  || !resJob.data.success) {
        info.type = 'error';
        info.value = resJob.data.message || 'error';
        info.loading = false;
        reject();
        return;
      }

      const job = resJob.data.job;
      console.log({job});
      info.type = 'info';
      info.value = resJob.data.message;

      // get shared keypairs
      const keypairId = `job||${job.creator}||${jobId}`;
      const resSharedKey = await request({
        username,
        wallet,
        url: appConfig.nerves.user.keypair.url,
        method: 'GET',
        params: {
          keypairId,
        },
      });

      if( !resSharedKey || !resSharedKey.data.success) {
        info.type = 'error';
        info.value = resSharedKey.data.message || 'error';
        info.loading = false;
        reject();
        return;
      }

      info.type = 'info';
      info.value = resSharedKey.data.message;
      info.loading = true;

      console.log(keypair, resSharedKey.data.keypair);

      const crypt = new Crypt();

      const rawSharedKeypair = crypt.decrypt(keypair.privateKey, JSON.stringify(resSharedKey.data.keypair));
      console.log({rawSharedKeypair});

      const sharedKeypair = JSON.parse(rawSharedKeypair.message);
      console.log({sharedKeypair});

      const decryptedJob = crypt.decrypt(sharedKeypair.privateKey, job.data);
      console.log({decryptedJob});

      const message = JSON.parse(decryptedJob.message);
      console.log({message});

      // get originalData
      resOriginalData = await request({
        username,
        wallet,
        url: appConfig.nerves.identity.url,
        method: 'GET',
        params: {
          identityId: job.creator,
        },
      });

      if( !resOriginalData || !resOriginalData.data.success) {
        info.type = 'error';
        info.value = resOriginalData.data.message || 'error';
        info.loading = false;
        reject();
        return;
      }

      console.log({resOriginalData});
      const decryptedOriginal = crypt.decrypt(sharedKeypair.privateKey, resOriginalData.data.identity.encryptedIdentity);
      decryptedOriginalIdentity = JSON.parse(decryptedOriginal.message);
      console.log({decryptedOriginalIdentity});

      info.value = '';
      info.loading = false;
      resolve(message);
    });
  };

  const decryptedJobPromise = getDecryptedJob();
</script>

<Header title="Verify" />
<Info info={info} />

{#await decryptedJobPromise then decryptedJobResult}
  <div>
    <table>
      <tr>
        <th>Job</th>
        <th>Original</th>
      </tr>
      <tr>
        <td>
          <Identity 
            identity={decryptedJobResult}
            kyc={resOriginalData.data.identity.kyc}
            confirmations={resOriginalData.data.identity.confirmations}
          />
        </td>
        <td>
          <Identity 
            identity={decryptedOriginalIdentity}
            kyc={resOriginalData.data.identity.kyc}
            confirmations={resOriginalData.data.identity.confirmations}
          />
        </td>
      </tr>
    </table>
  </div>
  <div class="refuse_approve_button">
    <Approve label="Approve" onclick={() => onClickApproveRefuse(jobId, 1)}></Approve>
    <Refuse label="Refuse" onclick={() => onClickApproveRefuse(jobId, 0)}></Refuse>
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
