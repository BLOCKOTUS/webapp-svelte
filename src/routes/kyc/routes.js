import Home from '@@Routes/kyc/Home.svelte';
import Jobs from '@@Routes/kyc/Jobs.svelte';
import Verify from '@@Routes/kyc/Verify.svelte';
import GetVerified from '@@Routes/kyc/GetVerified.svelte';
import Identity from '@@Routes/kyc/Identity.svelte';

export default {
  '/kyc/home': Home,
  '/kyc/verify/:jobId?': Verify,
  '/kyc/jobs': Jobs,
  '/kyc/getverified': GetVerified,
  '/kyc/identity': Identity,
};
