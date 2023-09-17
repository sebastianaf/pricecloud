(() => {
  function fillEndpoint() {
    document.getElementById('cloud-pricing-api-endpoint').innerText =
      window.location.href.replace(/\/$/, '');
  }

  function checkLatestVersion() {
    fetch(
      `https://api.github.com/repos/infracost/cloud-pricing-api/releases/latest`
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Error fetching latest version from GitHub');
      })
      .then((data) => {
        const latestVersion = data.tag_name.substr(1);

        let content = `
          <p><img src="/img/check.svg" class="icon" alt="Success" /> Cloud Pricing API is using the latest version.</p>
        `;
        // eslint-disable-next-line no-underscore-dangle
        if (latestVersion !== window.__CLOUD_PRICING_API_VERSION__) {
          content = `
          <p class="warning"><img src="/img/warning.svg" class="icon" alt="Warning" /> Cloud Pricing API is using an old version. <a href="https://www.infracost.io/cloud-pricing-api-upgrade" target="_blank">Upgrade to v${latestVersion}</a>.</p>
        `;
        }

        document.getElementById('version-message').innerHTML = content;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }

  function showStats() {
    const apiKey = document.getElementById('api-key-input').value;
    const priceUpdateThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days

    fetch('/stats', {
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 403) {
          throw new Error('Invalid API key');
        } else {
          throw new Error('Error fetching stats');
        }
      })
      .then((data) => {
        let pricesLastUpdatedContent = 'Never';
        if (data.pricesLastSuccessfullyUpdatedAt) {
          pricesLastUpdatedContent = new Date(
            data.pricesLastSuccessfullyUpdatedAt
          ).toLocaleString();
        }

        if (
          !data.pricesLastSuccessfullyUpdatedAt ||
          new Date(data.pricesLastSuccessfullyUpdatedAt).getTime() <
            new Date().getTime() - priceUpdateThreshold
        ) {
          pricesLastUpdatedContent += ` <img src="/img/warning.svg" class="icon status" /> <span>Prices haven't been updated for over 7 days</span>`;
        }

        let pricesLastUpdateSuccessfulContent =
          'Not available (price update job might still be running)';
        if (data.pricesLastUpdateSuccessful === true) {
          pricesLastUpdateSuccessfulContent = `<img src="/img/check.svg" class="icon status" alt="Success" />`;
        } else if (data.pricesLastUpdateSuccessful === false) {
          pricesLastUpdateSuccessfulContent = `<img src="/img/cross.svg" class="icon status" alt="Failed" />`;
        }

        document.getElementById('stats-results').innerHTML = `
        <table class="stats-table">
          <tr>
            <th>Last price update was successful</th>
            <td>${pricesLastUpdateSuccessfulContent}</td>
          </tr>
          <tr>
            <th>Prices last updated</th>
            <td>
              ${pricesLastUpdatedContent}
            </td>
          </tr>
          <tr>
            <th>Total number of cost estimates</th>
            <td>${data.totalRuns} since ${new Date(
          data.createdAt
        ).toLocaleDateString()} (${data.nonCiRuns} from CLI users, ${
          data.ciRuns
        } from CI/CD systems)</td>
          </tr>
          <tr>
            <th>CLI users using this service</th>
            <td>${data.nonCiInstalls}</td>
          </tr>
        </table>
      `;
      })
      .catch((error) => {
        document.getElementById('stats-results').innerHTML = `
        <span class="error">Error: ${error.message}</span>
      `;
      });
  }

  document.getElementById('api-key-submit').onclick = showStats;
  fillEndpoint();
  checkLatestVersion();
})();
