// Gera o valor de ADMIN_PASSWORD_HASH.
// Uso: npm run hash-password   (a senha é lida sem eco, não fica no histórico do shell)
import bcrypt from 'bcryptjs'
import readline from 'node:readline'

const COST = 12

function readPassword(): Promise<string> {
  if (!process.stdin.isTTY) {
    return new Promise((resolve) => {
      let data = ''
      process.stdin.on('data', (chunk) => (data += chunk))
      process.stdin.on('end', () => resolve(data.replace(/\r?\n$/, '')))
    })
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const write = (rl as unknown as { _writeToOutput: (s: string) => void })
  const original = write._writeToOutput.bind(rl)
  let prompting = true
  write._writeToOutput = (s: string) => (prompting ? original(s) : undefined)

  return new Promise((resolve) => {
    rl.question('Senha do admin: ', (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
    prompting = false
  })
}

async function main() {
  const password = await readPassword()
  if (password.length < 12) {
    console.error('Use uma senha com pelo menos 12 caracteres.')
    process.exit(1)
  }
  console.log(await bcrypt.hash(password, COST))
}

main()
