import { run } from "hardhat";

async function main() {
    const deploymentInfo = require("../src/contracts/deployment-info.json");

    console.log(`Verifying contract at ${deploymentInfo.address}...`);

    try {
        await run("verify:verify", {
            address: deploymentInfo.address,
            constructorArguments: [],
        });
        console.log("Contract verified successfully!");
    } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract is already verified!");
        } else {
            console.error("Error verifying contract:", error);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
