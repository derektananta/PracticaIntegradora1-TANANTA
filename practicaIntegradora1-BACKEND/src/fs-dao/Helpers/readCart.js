import fs from 'fs'

export const cartFile = 'src/Data/carts.json'
export let nextCartId = 0

export function readCart() {
    return new Promise((resolve, reject) => {
        fs.readFile(cartFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err)
                reject(err)
                return
            }

            try {
                const cartData = JSON.parse(data)
                cartData.carts.forEach(p => {
                    p.id = nextCartId++
                })

                resolve(cartData)
            } catch (parseError) {
                console.error('Error parsing JSON file:', parseError)
                reject(parseError)
            }
        })
    })
}
