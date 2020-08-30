import Home from '@@Routes/kyc/Home.svelte';
import Jobs from '@@Routes/kyc/Jobs.svelte';
import Verify from '@@Routes/kyc/Verify.svelte';
import GetVerified from '@@Routes/kyc/GetVerified.svelte';

export const KYCRoutes = {
    '/kyc/home': Home,
    '/kyc/verify/:jobId?': Verify,
    '/kyc/jobs': Jobs,
    '/kyc/getverified': GetVerified,
}