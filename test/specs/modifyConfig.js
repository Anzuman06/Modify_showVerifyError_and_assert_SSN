const fs = require('fs'); 
const path = require('path');

// Path to the mock server's configuration file
const configPath = path.join('C:\\Users\\ASUS\\OneDrive\\Documents\\MeldCXAPP\\Money_Transfer\\meldcx-money-transfer-app-mock-server\\src\\utils', 'environments.json');

// Function to modify the showVerifyError value inside validateBeforeSendingMoney
function modifyShowVerifyError(showError) {
  try {
    // Read the existing config file
    console.log(`Reading config file from: ${configPath}`);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Check if the validateBeforeSendingMoney section exists
    if (config.validateBeforeSendingMoney && typeof config.validateBeforeSendingMoney === 'object') {
      console.log(`Current showVerifyError value: ${config.validateBeforeSendingMoney.showVerifyError}`);
      
      // Modify the showVerifyError value
      config.validateBeforeSendingMoney.showVerifyError = showError;
      console.log(`Modifying showVerifyError to: ${showError}`);
      
      // Write the modified config back to the file
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`Config file updated successfully.`);

      // Re-read the file to verify the change
     // const updatedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
     // console.log(`Re-verified showVerifyError: ${updatedConfig.validateBeforeSendingMoney.showVerifyError}`);
      
     // if (updatedConfig.validateBeforeSendingMoney.showVerifyError !== showError) {
        //console.error(`Error: showVerifyError was not updated correctly!`);
     // } else {
        //console.log(`Success: showVerifyError is now set to ${showError}`);
     // }

    } else {
      console.error("validateBeforeSendingMoney section not found in the config.");
    }
  } catch (err) {
    console.error(`Error modifying config: ${err.message}`);
  }
}

module.exports = { modifyShowVerifyError };

describe('SSN/ITIN Form Validation', () => {

  // Helper function to restart the server after modifying the config
  async function restartMockServer() {
    console.log('Restarting mock server to apply new config...');
    await browser.pause(5000); // Wait for the server to restart and load new config
   }

  before(async () => {
    // Set up the browser environment
    await browser.url("http://127.0.0.1:5500");
    await browser.pause(3000);
    await $("#click-button").click();
    await browser.pause(3000);

    const numberArray = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    const numberLocator = num => `//div[@data-analytics-component='Numpad']//button[@aria-label='${num}' and @tabindex='0']`;

    for (let i = 0; i < numberArray.length; i++) {
      const num = numberArray[i];
      if (num >= 0 && num <= 9) {
        await $(numberLocator(num)).click();
      } else {
        console.log("Something went wrong");
      }
    }

    await $('//button[@aria-label="Terminado"]').click();
    await browser.pause(5000);
    
    const codeNumber = [2, 2, 2, 2, 2, 2];
    const OTP = num => `//div[@data-analytics-component='Numpad']//button[@aria-label='${num}' and @tabindex='0']`;

    for (let i = 0; i < codeNumber.length; i++) {
      const num = codeNumber[i];

      if (num >= 0 && num <= 9) {
        await $(OTP(num)).click();
      } else {
        console.log("Something went wrong");
      }
    }

    await $('//button[@class="components__NumpadItem-sc-1fgmark-2 bsckYD"]').click();
    await browser.pause(10000);

    await $('//button[@aria-label="Enviar a JADAV S, con Cantidad: 60.84 USD"]').click();
    await browser.pause(5000);
    await $('//button[@aria-label="Si entiendo"]').click();
    await browser.pause(5000);
    await $('//button[@aria-label="Continuar"]').click();
    await browser.pause(2000);
  });
  it('should conditionally display the SSN page based on showVerifyError value', async () => {
   
   await $("//button[@aria-label='Si entiendo']").click();
   await $("//input[@id='search']").click();
   await $("//input[@id='search']").setValue("kkkk");
   await $("//div[@class='components__ModalWrapper-dkei8z-4 NMnOg']").click();
   await $("//button[@class='Button-zquyky-1 cWOeYY']").click();
   await $("//button[@aria-label='No, continúa']").click()
   await browser.pause(20000);

    const showVerifyErrorValue = true; // Modify this value (true or false) to test the respective scenario
    modifyShowVerifyError(showVerifyErrorValue); // Modify the configuration
    await restartMockServer(); // Restart the mock server to apply the change
    await browser.pause(5000); // Wait for the app to reflect the updated config
   

   
    await $("//button[@aria-label='Confirmar para continuar']").click();
    await browser.pause(2000);

    const isSSNPageVisible = await $("//h1[@aria-label='Ingrese su información a  completa la transacción']").isDisplayed();
    console.log(`Test expectation: showVerifyError is set to ${showVerifyErrorValue}`);
    console.log(`Actual result: SSN Page visibility is ${isSSNPageVisible}`);

    if (showVerifyErrorValue) {
      // Test case when showVerifyError is true
      console.log("Expecting SSN page to be visible.");
      expect(isSSNPageVisible).toBe(true); // Expect SSN page to be visible

      if (isSSNPageVisible) {
        let p1 = await $('//h1[@aria-label="Ingrese su información a  completa la transacción"]').getText();
        expect(p1).toHaveText('Ingrese su información a completa la transacción');
        console.log("SSN/ITIN page displayed as expected.");

        await $("//button[@name='itin']").click();
        await $("//body//div[@id='app']//div[@class='components__DetailsForm-sc-1wky9am-1 eQpYYG']//div//div//div[1]").click();
        let SSN_ITIN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const SNTN = num => `//div[@data-analytics-component='Numpad']//button[@aria-label='${num}' and @tabindex='0']`;

        for (let i = 0; i < SSN_ITIN.length; i++) {
          const num = SSN_ITIN[i];
          if (num >= 0 && num <= 9) {
            await $(SNTN(num)).click();
          } else {
            console.log("Something went wrong");
          }
        }

        await $("//button[@aria-label='Terminado']").click();
        await $("//button[@id='identity-component-continue-button']").click();
        await browser.pause(2000);
      } else {
        console.error("Error: SSN page is not displayed when it should be.");
      }

    } else {
      // Test case when showVerifyError is false
      console.log("Expecting SSN page to not be visible.");
      expect(isSSNPageVisible).toBe(false); // Expect SSN page not to be visible

      if (!isSSNPageVisible) {
        console.log("SSN page is correctly not displayed.");
      } else {
        console.error("Error: SSN page is displayed when it should not be.");
      }
    }
  });
});