contract collector{

  /**
   * Pricing and data volume information for a data category.
   *
   * Price information, used to determine the current and updated price
   * information for a given data type and level of clustering. In particular,
   * this structure stores not only the current price information, but also
   * the statistics of how much data has been submitted in this category for a
   * given time period, allowing the smart contract to dynamically update its
   * price.
   *
   * Fields:
   *     price: the current price of the data category.
   *     lastUpdate: the time at which the price was last updated.
   *     submitted: the number of data points submitted since lastUpdate.
   *     subThresh: the maximum number of data points submittable before
   *                      the price is decreased.
   *     timeThresh: the maximum amount of time to wait before the price is
   *                    increased.
   */
  struct priceInfo {
    uint price;
    uint lastUpdate;
    uint subCount;
    uint subThresh;
    uint timeThresh;
  }

  /**
   * Collector's address.
   *
   * Ethereum address of the data collector. Only the data collector is allowed
   * to authorize payments to users and to modify pricing information. In order
   * to enforce this, the address of the contract creator is initialized upon
   * contract deployment and only this address can call most of the functions
   * in this contract.
   */
  address contractOwner;

  /**
   * Pricing information table.
   *
   * Store the pricing information in a table organized by data type and level
   * of summarization.
   */
  mapping (uint => mapping(uint => priceInfo)) buyPrices;

  /**
   * Only allow the contract owner (the data collector) to call a function.
   */
  modifier ifOwner() {
    if(msg.sender != contractOwner) {
      throw;
    } else {
      _
    }
  }

  /**
   * Constructor. Initialize the contract with the owner information.
   *
   * Initialize the current contract with the owner's information, namely, the
   * collector purchasing data from users. Note that this DOES NOT initialize
   * the cells of the pricing table; this must be done manually.
   */
  function collector() {
    contractOwner = msg.sender;
  }

  /**
   * Manually set the pricing information of a given cell in the pricing table.
   *
   * Arguments:
   *   data (uint): the type identifier of the data.
   *   privacy (uint): the level of clustering.
   *   price (uint): the price to set.
   *   subThresh (uint): the number of data points to accept before
   *                           decreasing the price.
   *   timeThresh (uint): the time that can elapse before the price
   *                         increases.
   */
  function setPrice(uint data, uint summ, uint price, uint subThresh,
                    uint timeThresh) ifOwner {
    buyPrices[data][summ].price = price;
    buyPrices[data][summ].lastUpdate = now;
    buyPrices[data][summ].subCount = 0;
    buyPrices[data][summ].subThresh = subThresh;
    buyPrices[data][summ].timeThresh = timeThresh;
  }

  /**
   * Get the price information associate with a cell in the pricing table.
   *
   * Arguments:
   *   data (uint): the type identifier of the data.
   *   privacy (uint): the level of clustering.
   *
   * Returns:
   *   A priceInfo struct associated with the appropriate cell of the pricing
   *   table.
   */
  function getPrice(uint data, uint summ) constant returns(uint price,
                                                           uint lastUpdate,
                                                           uint subThresh,
                                                           uint timeThresh,
                                                           uint subCount) {
    price = buyPrices[data][summ].price;
    lastUpdate = buyPrices[data][summ].lastUpdate;
    subThresh = buyPrices[data][summ].subThresh;
    timeThresh = buyPrices[data][summ].timeThresh;
    subCount = buyPrices[data][summ].subCount;
  }

  /**
   * Send payment for data to a contributing user.
   *
   * Given a user who has provided an address and some amount of data, send the
   * appropriate amount of funds as payment. The payment amount sent follows the
   * following rules:
   *
   *   1. If the amount of time since the last submission of this data type and
   *      level of summarization is longer than the allowed threshold, increase
   *      the price.
   *   2. If the volume of data being sent is over the threshold of maximum data
   *      volume desired in this type and level of summarization, only pay the
   *      user up to the threshold and decrease the price for future
   *      submissions.
   *   3. If neither of the above cases occur, simply pay the user at the
   *      current rate for data submission, and update the table accordingly.
   *
   * It is possible to instead specify a contract address that allows arbitrary
   * payment calculation functions to be written. This function would then be
   * modified to simply look up the price information in its table and pass that
   * along with the user data in a transaction to the contract.
   *
   * Arguments:
   *   user (address): the address of the user receiving the payment.
   *   data (uint): the type identifier of the data.
   *   summ (uint): the level of summarization (e.g., the number of clusters
   *                from a k-means algorithm).
   *   volume (uint): the number of data points contributed by the user in the
   *                  current submission.
   */
  function payUser(address user, uint data, uint summ, uint volume) ifOwner {
    priceInfo cell = buyPrices[data][summ];
    uint payment;
    if (now - cell.lastUpdate > cell.timeThresh) {
      cell.price = 2 * cell.price - cell.subCount * cell.price / cell.subThresh;
      cell.subCount = 0;
      cell.lastUpdate = now;
    }
    uint remaining = cell.subThresh - cell.subCount;
    if (volume >= remaining) {
        volume = remaining;
        payment = volume * cell.price;
        cell.price = cell.price * (now - cell.lastUpdate) / cell.timeThresh;
        cell.subCount = 0;
        cell.lastUpdate = now;
    } else {
        payment = volume * cell.price;
        cell.subCount += volume;
    }
    bool val = user.send(payment);
  }
}
