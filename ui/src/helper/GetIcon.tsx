import { ReactElement } from 'react';
import { FaAws } from 'react-icons/fa';
import { SiGooglecloud, SiMicrosoftazure } from 'react-icons/si';

export const GetIcon = (props: { tag: string }): ReactElement => {
  switch (props?.tag) {
    case 'aws':
      return <FaAws size={48} />;
    case 'azure':
      return <SiMicrosoftazure size={48} />;
    case 'gcp':
      return <SiGooglecloud size={48} />;
    default:
      return <></>;
  }
};
