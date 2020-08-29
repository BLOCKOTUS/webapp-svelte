import Home from '@@Routes/kyc/Home.svelte';
import Verify from '@@Routes/kyc/Verify.svelte';
import GetVerified from '@@Routes/kyc/GetVerified.svelte';
import Success from '@@Routes/kyc/Success.svelte';

export const KYCRoutes = {
    '/kyc/home': Home,
    '/kyc/verify/:jobId?': Verify,
    '/kyc/getverified': GetVerified,
    '/kyc/success': Success,
}