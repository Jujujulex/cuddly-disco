import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    console.log("Deploying MusicNFT contract...");

    const MusicNFT = await ethers.getContractFactory("MusicNFT");
    const musicNFT = await MusicNFT.deploy();

    await musicNFT.waitForDeployment();

    const address = await musicNFT.getAddress();
    console.log(`MusicNFT deployed to: ${address}`);

    // Save deployment info
    const deploymentInfo = {
        address,
        network: (await ethers.provider.getNetwork()).name,
        chainId: Number((await ethers.provider.getNetwork()).chainId),
        timestamp: new Date().toISOString(),
    };

    const deploymentPath = path.join(__dirname, "../src/contracts/deployment-info.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`Deployment info saved to ${deploymentPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
