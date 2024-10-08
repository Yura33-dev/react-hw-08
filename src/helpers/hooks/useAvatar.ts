export function useAvatar(userName: string): {
  avatar: { sx: object; children: string };
} {
  function stringToColor(name: string) {
    if (!name || name.length < 2) return '#bdbdbd';

    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < name.length; i += 1) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function generateUserSign(name: string) {
    const splitedName = name.toUpperCase().split(' ');

    if (splitedName.length === 1) {
      return `${splitedName[0][0]}${splitedName[0][splitedName[0].length - 1]}`;
    } else {
      return `${splitedName[0][0]}${splitedName[splitedName.length - 1][0]}`;
    }
  }

  const avatar = {
    sx: {
      bgcolor: stringToColor(userName),
      fontSize: { xs: 14, md: 20 },
      width: { xs: 30, md: 40 },
      height: { xs: 30, md: 40 },
    },
    children:
      userName && userName.length >= 2 ? generateUserSign(userName) : 'null',
  };

  return { avatar };
}
