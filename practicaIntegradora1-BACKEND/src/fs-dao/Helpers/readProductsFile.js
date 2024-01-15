import fs from 'fs'

export const productsFile = 'src/Data/products.json'
export let nextProductId = 0

export function readProductsFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(productsFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err)
                reject(err)
                return
            }

            try {
                const productsData = JSON.parse(data)
                productsData.products.forEach(p => {
                    p.id = nextProductId++
                })

                resolve(productsData)
            } catch (parseError) {
                console.error('Error parsing JSON file:', parseError)
                reject(parseError)
            }
        })
    })
}
