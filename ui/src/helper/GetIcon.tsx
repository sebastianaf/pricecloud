import { ReactElement } from 'react';
import { FaAws } from 'react-icons/fa';
import { SiGooglecloud, SiMicrosoftazure } from 'react-icons/si';

export const GetIcon = (props: any): ReactElement => {
  switch (props?.tag) {
    case 'aws':
      return <FaAws {...props} />;
    case 'azure':
      return <SiMicrosoftazure {...props} />;
    case 'gcp':
      return <SiGooglecloud {...props} />;
    default:
      return <></>;
  }
};
