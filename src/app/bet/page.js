"use client"
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { claimPrize, getDispute, placeBet } from "@/services/web3Services";
import Web3 from "web3";

export default function Bet() {
    const { push } = useRouter();

    const [message, setMessage] = useState();
    const [dispute, setDispute] = useState({

        candidate1: "Loading...",
        candidate2: "Loading...",
        image1: "https://vejasp.abril.com.br/blogs/miguel-barbieri/2013/06/26/uma-curiosidade-sobre-o-mascarado-de-v-de-vinganca/v-de-vinganca-1/",
        image2: "https://vejasp.abril.com.br/blogs/miguel-barbieri/2013/06/26/uma-curiosidade-sobre-o-mascarado-de-v-de-vinganca/v-de-vinganca-1/",
        total1: 0,
        total2: 0,
        winner: 0

    });

    useEffect(() => {

        if (!localStorage.getItem("wallet")) return push("/");
        setMessage("Coletando numeros de apostas");
        getDispute()
            .then(dispute => {
                setDispute(dispute);
                setMessage("");

            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);

            })


    }, []);


    function processBet(candidate) {
        setMessage("Conectando na carteira... aguarde..");
        const amount = prompt("Quantia em aposta", "1");
        placeBet(candidate, amount)
            .then(() => {
                alert("Aposta recebida com sucesso, aguarde o processamento no sistema");
                setMessage("");
            })
            .catch(err => {
                console.error(err.data ? err.data : err);
                setMessage(err.data ? err.data.message : err.message);

            })

    }


    function btnClaimclick() {

        setMessage("Conectando na carteira... aguarde..");

        claimPrize()
            .then(() => {
                alert("Premio coletado com sucesso, aguarde o processamento no sistema");
                setMessage("");
            })
            .catch(err => {
                console.error(err.data ? err.data : err);
                setMessage(err.data ? err.data.message : err.message);

            })

    }


    return (
        <>
            <Head>
                <title>BetCandidate | Apostar</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="container px-4 py-5">
                <div className="row align-items-center">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">BetCandidate</h1>
                    <p className="lead">Apostas on-chain nas eleições americanas.</p>
                    <p className="lead">Você tem até o dia da eleição para deixar sua aposta em um dos candidatos abaixo.</p>
                    {

                        dispute.winner == 0
                            ? <p className="lead">Aproveite ate o termino do concurso</p>
                            : <p className="lead">Disputa encerrada, solicite seu premio.</p>
                    }



                </div>
                <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
                    <div className="col"></div>
                    {
                        dispute.winner == 0 || dispute.winner == 1
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                                    {dispute.candidate1}
                                </h3>
                                <img src={dispute.image1} className="d-block mx-auto img-fluid rounded" width={250} />
                                {
                                    dispute.winner == 1
                                        ? <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }} onclick={btnClaimclick} >Pegar Premio</button>
                                        : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }} onclick={() => processBet(1)} >Aposto nesse candidato</button>


                                }


                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>{Web3.utils.fromWei(dispute.total1, "ether")} POL Apostados</span>
                            </div>
                            : <></>
                    }
                    {

                        dispute.winner == 0 || dispute.winner == 2
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                                    {dispute.candidate2}
                                </h3>
                                <img src={dispute.image2} className="d-block mx-auto img-fluid rounded" width={250} />
                                {
                                    dispute.winner == 2
                                        ? <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }} onclick={btnClaimclick} >Pegar Premio</button>
                                        : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }} onclick={() => processBet(2)} >Aposto nesse candidato</button>


                                }


                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>{Web3.utils.fromWei(dispute.total2, "ether")} POL Apostados</span>
                            </div>
                            : <></>
                    }


                </div>
                <div className="row align-items-center">
                    <p className="message">{message}</p>
                </div>
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <p className="col-4 mb-0 text-body-secondary">
                        &copy; 2024 BetCandidate, Inc
                    </p>
                    <ul className="nav col-4 justify-content-end">
                        <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li>
                        <li className="nav-item"><a href="/about" className="nav-link px-2 text-body-secondary">About</a></li>
                    </ul>
                </footer>
            </div>
        </>
    );
}