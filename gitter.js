const { exec } = require('child_process');

const greeting = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [9, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
];

const fileName = './modify-me.txt';

const updateFile = (date) => new Promise((res, rej) => {
  exec(
    `echo "${date}" >> ${fileName}`,
    (error, stdout, stderr) => error ? rej(error) : res(stdout),
  );
});

const gitCommit = (date) => new Promise((res, rej) => {
  exec(
    `GIT_COMMITTER_DATE="${date}" git commit --date "${date}" -m "chore: ${date}" ${fileName}`,
    (error, stdout, stderr) => error ? rej(error) : res(stdout),
  );
});

const formatDate = (d) => {
  const year = d.getFullYear();
  const month = d.toLocaleString('default', { month: 'short' });
  const date = d.getDate();
  const weekday = d.toLocaleDateString('default', { weekday: 'short' });

  return `${weekday} ${month} ${date} 12:00 ${year} +0000`;
};

const main = async (startDate) => {
  const x = greeting[0].length;
  const y = greeting.length;

  for (const row of greeting) {
    console.log(row.map((v) => v ? 'O' : ' ').join(' '));
  }

  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      startDate.setDate(startDate.getDate() + 1);
      const count = greeting[j][i];
      for (let c = 0; c < count; c++) {
        const date = formatDate(startDate);
        console.log('committing:', date);
        await updateFile(date);
        await gitCommit(date);
      }
    }
  }
};

main(new Date('2023-01-01')).catch(console.log);
