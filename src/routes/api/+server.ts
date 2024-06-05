interface API {
    GET: {
        test: {
            in: { a: string }
            out: { a: string }
        }
    }
    POST: {}
}

interface APIClient {
    GET: {
        test: (o: { a: string }) => Promise<{ a: string }>
    }
    POST: {}
}

const ac = {} as unknown as APIClient
const APIC: APIClient = new Proxy(ac, {
    get(_, verb: 'GET' | 'POST') {
        return new Proxy(
            {},
            {
                get(_, key: keyof API[typeof verb]) {
                    return (o: API[typeof verb][typeof key]['in']) => {
                        return fetch(`/api/${key}`, {
                            method: verb,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(o),
                        }).then((res) => res.json())
                    }
                },
            }
        )
    },
})

APIC.GET.test({ a: 'a' }).then(console.log)
