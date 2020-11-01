export type InfoType = {
    type: 'error' | 'info' | '';
    value: string;
    loading: boolean;
}

export const makeInfoProps = (
    type: 'error' | 'info' | '',
    value: string, 
    loading: boolean,
): InfoType => ({ value, type, loading });
