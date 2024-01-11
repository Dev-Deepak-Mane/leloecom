import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Image,
  Flex,
  Heading,
  Link,
  Text,
  Button,
  Stack,
  Badge,
  Icon,
  Center,
} from "@chakra-ui/react";
import Rating from "react-rating-stars-component";
import { MinusIcon, SmallAddIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { getProductDetails } from "../Redux/Products/action";
import { createStandaloneToast } from "@chakra-ui/react";
import MetaData from "../Layouts/MetaData";

import { addToCart } from "../Redux/Cart/action";

import ReviewProduct from "../Components/Products/ReviewProduct";

function SingleProduct() {
  const { product, loading } = useSelector((store) => store.productDetails);
  const params = useParams();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState("");
  //console.log(product.product.images[0]);
  const { toast } = createStandaloneToast();

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };
  const [quantity, setQuantity] = useState(product?.product?.Stock || 1);

  const handleDecrease = () => {
    if (quantity <= 1) {
      return;
    }

    setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity >= product?.product?.Stock) {
      return;
    }
    setQuantity(quantity + 1);
  };

  const handleAddToCart = (quantity) => {
    dispatch(addToCart(toast, params.id, quantity));
  };

  useEffect(() => {
    dispatch(getProductDetails(params.id, toast)).then(() => {
      // Check if product and product images exist before setting selectedImage
      if (product && product?.product?.images.length > 0) {
        setSelectedImage(product.product.images[0]);
      }
    });
  }, [params.id, dispatch, product?.product?.images.length]);

  return (
    <>
      <MetaData title={product.product?.name} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box maxW="full" p={{ base: "1rem", md: "2rem" }}>
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="20px">
              {/* Image display */}
              {product?.product?.images && (
                <Box>
                  <Box m="auto" maxW="l">
                    <Image
                      objectFit={"contain"}
                      w="100%"
                      h={{ base: "auto", md: "400px" }}
                      src={selectedImage.url}
                      alt={selectedImage.alt}
                    />
                  </Box>
                  <Flex justifyContent={{ base: "flex-start", md: "center" }}>
                    {product?.product?.images.map((image) => (
                      <Box
                        key={image._id}
                        mt="2rem"
                        ml="2rem"
                        w={{ base: "100%", md: "auto" }}
                      >
                        <Link
                          onClick={() => handleImageSelect(image)}
                          cursor="pointer"
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            w={{ base: "100px", md: "150px" }}
                            h="auto"
                          />
                        </Link>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Product content */}
              <Box>
                <Heading as="h1" fontSize={{ base: "xl", md: "3xl" }} mb="1rem">
                  {product.product?.name}
                </Heading>

                <Heading as="h3" fontSize={{ base: "xl", md: "3xl" }} mb="1rem">
                  ₹{product.product?.price} INR
                </Heading>

                <Flex mb="1rem">
                  <Badge colorScheme="green">In Stock</Badge>
                  <Text color="gray.500" fontSize="sm" ml={{ md: "1rem" }}>
                    {product?.product?.Stock}: left
                  </Text>
                </Flex>
                <Flex gap={2} mb="1rem">
                  <Heading size={"md"}>Category : </Heading>
                  <Text> {product?.product?.category}</Text>
                </Flex>
                <Flex gap={2} mb="1rem">
                  <Button onClick={handleDecrease}>-</Button>
                  <Button disabled>{quantity}</Button>
                  <Button onClick={handleIncrease}>+</Button>
                </Flex>
                <Flex gap={2} mb="1rem">
                  <Button
                    colorScheme="blue"
                    onClick={() => handleAddToCart(quantity)}
                  >
                    Add to Cart
                  </Button>
                </Flex>

                <Heading mt="2rem" fontWeight="semibold" color="gray.700">
                  Description
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {product?.product?.description}
                </Text>

                <ReviewProduct productId={product?.product?._id} />
              </Box>
            </Grid>
          </Box>
          {/* ////// review box start from here  */}

          <Box
            overflowX={{ base: "unset", md: "scroll" }}
            maxW="100%"
            pb={{ base: 0, md: 4 }}
          >
            <Box
              display={{ base: "block", md: "flex" }}
              flexWrap="nowrap"
              w="max-content"
            >
              {product?.product?.reviews &&
                product?.product?.reviews.map((e) => (
                  <Box
                    key={e?._id}
                    boxShadow="lg"
                    borderRadius="md"
                    width={["xs", "md"]}
                    minH={"350px"}
                  >
                    <Stack p={4} spacing={2} align={"center"}>
                      <Box borderRadius={"100%"} w="100px" h="100px">
                        <Image
                          objectFit="cover"
                          src={
                            "https://www.svgrepo.com/show/295402/user-profile.svg"
                          }
                          alt="User profile picture"
                          w="100%"
                        />
                      </Box>
                      <Text fontWeight="bold">{e?.name}</Text>
                      <Rating
                        count={5}
                        value={e?.rating} // Set fixed value to 3
                        edit={false} // Disable user interaction
                        size={24}
                        isHalf={true}
                        activeColor="#ffd700"
                      />
                      <Text textAlign={"center"} w="90%">
                        {e?.comment}
                      </Text>
                    </Stack>
                  </Box>
                ))}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default SingleProduct;
